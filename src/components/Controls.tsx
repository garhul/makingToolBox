import { useState } from "react";
import { Badge, Container, Row, Form } from "react-bootstrap";
import { ShapeParameter } from "src/types";
import { BsArrowUpSquare } from 'react-icons/bs/';
import { shapeListOption } from "src/shapes";

export default function Controls() {
  return (
    <Container>
      <Row>

      </Row>
    </Container>
  )
}

export type shapeControlsProps = {
  onChange: (key: string, value: number) => void;
  controlsList: ShapeParameter[];
}

export function ShapeControls({ controlsList, onChange }: shapeControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  const Controls = controlsList.map(c => (
    <Row className="controlGroup" key={c.key}>
      <label title={c.tooltip || c.name} htmlFor={c.key}>{c.name} - [{c.value}]</label>
      <input id={c.key} step={c.step} type="range" onChange={(ev) => onChange(c.key, parseFloat(ev.currentTarget.value))} />
    </Row>
  ));

  return (
    <Container>
      <Row>
        <Badge>
          Shape properties <BsArrowUpSquare onClick={toggleCollapsed} />
        </Badge>
      </Row>
      {!collapsed && Controls}
    </Container>
  )
}


export type shapeSelectorProps = {
  onChange: (key: string) => void;
  options: shapeListOption[];
}

export function ShapeSelector({ onChange, options }: shapeSelectorProps) {
  const Opts = options.map((v, i) => <option value={v.key}>{v.name}</option>);
  return (
    <Form.Select size="sm" onChange={(ev) => onChange(ev.currentTarget.value)}>
      {Opts}
    </Form.Select>
  )
}