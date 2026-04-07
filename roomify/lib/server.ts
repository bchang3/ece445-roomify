import { Remote, RemoteButton } from "./types";

export async function pressButton(boardSerial: string, command: string) {
  if (!boardSerial || !command) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL!}/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board_serial: boardSerial,
        command: command,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error triggering command:", text);
      throw new Error(`Failed to trigger command: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("pressButton error:", err);
  }
}

export async function getRemotes(boardSerial: string): Promise<Remote[]> {
  if (!boardSerial || boardSerial === "undefined") return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL!}/remotes/${boardSerial}`,
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error fetching remotes:", text);
      throw new Error(`Failed to fetch remotes: ${res.status}`);
    }

    const json = await res.json();
    return json.remotes || [];
  } catch (err) {
    console.error("getRemotes error:", err);
    return [];
  }
}

export async function getButtons(remoteId: string): Promise<RemoteButton[]> {
  if (!remoteId || remoteId === "undefined") return [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL!}/buttons/${remoteId}`,
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Error fetching buttons:", text);
      throw new Error(`Failed to fetch buttons: ${res.status}`);
    }

    const json = await res.json();
    return json.buttons || [];
  } catch (err) {
    console.error("getButtons error:", err);
    return [];
  }
}
