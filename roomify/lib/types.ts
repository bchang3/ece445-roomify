export type DeviceType = 'TV' | 'AC' | 'PROJECTOR' | 'LIGHT';

export interface Remote {
  id: string;
  name: string;
  device_type: DeviceType;
  board_serial: string;
}

export interface RemoteButton {
  id: string;
  name: string;
  command: string;
  remote_id: string;
}