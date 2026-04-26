import { JesusNpcCharacter, getJesusNpcMessage, type JesusNpcPose } from "../src/components/characters/JesusNpcCharacter";

export { getJesusNpcMessage, type JesusNpcPose };

export function JesusNpc({
  pose = "idle",
  size,
  message,
  label,
}: {
  pose?: JesusNpcPose;
  size?: number;
  message?: string;
  label?: string;
}) {
  return <JesusNpcCharacter pose={pose} displaySize={size} message={message} label={label} />;
}
