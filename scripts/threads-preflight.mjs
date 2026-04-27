#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const TZ = 'Asia/Seoul';
const EXPECTED_HOURS = [7, 9, 11, 13, 15, 17, 19, 21, 23];
const RISK_LIMIT = Number(process.env.THREADS_PREFLIGHT_RISK_LIMIT || 6);
const REQUIRED_BRAND_VERSION = process.env.THREADS_REQUIRED_BRAND_VERSION || 'brand-flow-v1';

function nowKST() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TZ }));
}

function dateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function parseJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function normalizeForDuplicate(text = '') {
  return String(text || '')
    .replace(/#[\w가-힣]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function fail(reasons, reason) {
  reasons.push(reason);
}

function main() {
  const date = process.argv[2] || dateStr(nowKST());
  const queuePath = path.resolve(`ops/threads/queue/${date}.json`);
  const auditPath = path.resolve(`ops/threads/audit/${date}.json`);
  const qualityPath = path.resolve(`ops/threads/quality/${date}.json`);
  const researchPath = path.resolve(`ops/threads/research/${date}.json`);
  const strategyPath = path.resolve(`ops/threads/strategy/${date}.json`);
  const blockDir = path.resolve('ops/threads/state/blocked');
  const preflightDir = path.resolve('ops/threads/state/preflight');
  const logDir = path.resolve('ops/threads/logs');
  const blockPath = path.join(blockDir, `${date}.json`);
  const preflightPath = path.join(preflightDir, `${date}.json`);

  fs.mkdirSync(blockDir, { recursive: true });
  fs.mkdirSync(preflightDir, { recursive: true });
  fs.mkdirSync(logDir, { recursive: true });

  const reasons = [];
  const warnings = [];
  const queue = readJson(queuePath);
  const audit = readJson(auditPath);
  const quality = readJson(qualityPath);
  const research = readJson(researchPath);
  const strategy = readJson(strategyPath);

  if (!queue) fail(reasons, `queue missing or unreadable: ${queuePath}`);
  if (!audit) fail(reasons, `audit missing or unreadable: ${auditPath}`);
  if (!quality) fail(reasons, `quality report missing or unreadable: ${qualityPath}`);
  if (!research) fail(reasons, `research brief missing or unreadable: ${researchPath}`);
  if (!strategy) fail(reasons, `strategy brief missing or unreadable: ${strategyPath}`);
  if (quality && quality.status !== 'ok') fail(reasons, `quality status is ${quality.status || 'unknown'}`);
  if (queue && quality) {
    try {
      const queueMtime = fs.statSync(queuePath).mtimeMs;
      const qualityMtime = fs.statSync(qualityPath).mtimeMs;
      if (qualityMtime < queueMtime) fail(reasons, 'quality report is older than queue');
    } catch {
      fail(reasons, 'could not compare queue/quality mtimes');
    }
  }

  if (queue) {
    if (queue.date !== date) fail(reasons, `queue date mismatch: ${queue.date || 'unknown'}`);
    if (queue.generator !== 'career-cron-v2') fail(reasons, `unexpected generator: ${queue.generator || 'unknown'}`);
    if (queue?.brand?.generatorVersion !== REQUIRED_BRAND_VERSION) fail(reasons, `queue brand mismatch: ${queue?.brand?.generatorVersion || 'missing'}`);
    if (queue.sourceResearch !== date) fail(reasons, `queue sourceResearch mismatch: ${queue.sourceResearch || 'missing'}`);
    if (queue.sourceStrategy !== date) fail(reasons, `queue sourceStrategy mismatch: ${queue.sourceStrategy || 'missing'}`);
    if (!Array.isArray(queue.posts)) {
      fail(reasons, 'queue.posts is not an array');
    } else {
      if (queue.posts.length !== EXPECTED_HOURS.length) fail(reasons, `expected ${EXPECTED_HOURS.length} posts, got ${queue.posts.length}`);
      const hours = queue.posts.map((post) => Number(post.hour)).sort((a, b) => a - b);
      if (JSON.stringify(hours) !== JSON.stringify(EXPECTED_HOURS)) fail(reasons, `unexpected hours: ${hours.join(',') || 'none'}`);

      const seen = new Map();
      for (const post of queue.posts) {
        const hour = Number(post.hour);
        const text = String(post.text || '').trim();
        const key = normalizeForDuplicate(text);
        if (!text) fail(reasons, `empty text at ${hour}:00`);
        if (text.length > 500) fail(reasons, `text too long at ${hour}:00 (${text.length})`);
        if (post.track && !['teen', 'youth', 'mid'].includes(post.track)) fail(reasons, `unexpected track at ${hour}:00: ${post.track}`);
        if (post.brand !== REQUIRED_BRAND_VERSION) fail(reasons, `post brand mismatch at ${hour}:00: ${post.brand || 'missing'}`);
        if (key && seen.has(key)) fail(reasons, `duplicate text inside queue: ${seen.get(key)}:00 and ${hour}:00`);
        if (key) seen.set(key, hour);
      }

      const publishLogs = parseJsonl(path.resolve('ops/threads/logs/publish.jsonl'));
      const published = new Map(publishLogs.map((row) => [normalizeForDuplicate(row?.text || ''), row]));
      for (const post of queue.posts) {
        const dup = published.get(normalizeForDuplicate(post.text || ''));
        if (!dup) continue;
        if (dup.date === date && Number(dup.hour) === Number(post.hour)) continue;
        warnings.push(`duplicate candidate: ${post.hour}:00 matches ${dup.date} ${dup.hour}:00; publisher will regenerate or block`);
      }
    }
  }

  if (audit) {
    const riskScore = Number(audit?.summary?.riskScore ?? 0);
    if (!Number.isFinite(riskScore)) fail(reasons, 'audit riskScore is not numeric');
    if (riskScore > RISK_LIMIT) fail(reasons, `audit riskScore too high: ${riskScore} > ${RISK_LIMIT}`);
    const warned = Array.isArray(audit.posts) ? audit.posts.filter((post) => Array.isArray(post.warnings) && post.warnings.length) : [];
    if (warned.length >= 4) fail(reasons, `too many warned slots: ${warned.length}`);
  }

  const status = reasons.length ? 'blocked' : 'ok';
  const result = {
    at: new Date().toISOString(),
    date,
    status,
    reason: reasons[0] || null,
    reasons,
    warnings,
    riskLimit: RISK_LIMIT,
    queuePath,
    auditPath,
    qualityPath,
    researchPath,
    strategyPath
  };

  fs.writeFileSync(preflightPath, JSON.stringify(result, null, 2));
  fs.appendFileSync(path.join(logDir, 'preflight.jsonl'), JSON.stringify(result) + '\n');

  if (status === 'blocked') {
    fs.writeFileSync(blockPath, JSON.stringify(result, null, 2));
    console.error(`Threads preflight blocked ${date}: ${reasons.join('; ')}`);
    process.exit(1);
  }

  if (fs.existsSync(blockPath)) fs.unlinkSync(blockPath);
  console.log(`Threads preflight ok ${date}`);
}

main();
