export type DeviceType = "TV" | "AC" | "PROJECTOR" | "LIGHT";

export type Preset = {
  id: string;
  name: string;
  playlist_id: string | null;
  playlist_name: string | null;
  button_ids: string[];
  buttons: RemoteButton[];
};

export type PresetButton = {
  id: string;
  name: string;
  command: string;
  remotes: { name: string } | null;
};

export type TokenBundle = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // ms timestamp
};

export interface Remote {
  id: string;
  name: string;
  device_type: DeviceType;
  device_header: string;
  board_serial: string;
}

export interface SpotifyImg {
  url: string;
}

export interface SpotifyUser {
  id: string;
}
export interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  public: boolean;
  owner: SpotifyUser;
  images: SpotifyImg[];
}

export interface RemoteButton {
  id: string;
  name: string;
  command: string;
  remote_id: string;
  remote?: { name: string };
}
