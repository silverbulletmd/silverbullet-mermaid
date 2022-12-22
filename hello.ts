import { editor } from "$sb/silverbullet-syscall/mod.ts";

const loneRangerQuotes = [
  "Hi-Yo! Silver",
  "Hi-Yo! Silver! Away!",
  "Kemo Sabe",
  "Get-um up, Scout!",
];

export async function helloWorld() {
  await editor.flashNotification(
    loneRangerQuotes[Math.floor(Math.random() * loneRangerQuotes.length)],
  );
}
