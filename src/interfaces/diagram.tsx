export interface DiagramInterface {
  name: string;
  nodes: NodeBlock[];
}

export interface InOutParam {
  value_is_reference: false;
  id: string;
  name: string;
  type: string;
  value: any;
  assignment: string | null;
  assignment_node: string | null;
}

export interface NodeBlock {
  id: string;
  type: string;
  out_node: string | null;
  can_be_executed: boolean;
  can_execute: boolean;
  friendly_name: string;
  block_type: string;
  _x: number;
  _y: number;
  in_parameters: InOutParam[];
  out_parameters: InOutParam[];
}
