import { useState } from "react";
import { Badge, Container, Row, OverlayTrigger, Tooltip, Button, ButtonGroup } from "react-bootstrap";
import { ShapeParameters, ShapeParameterValue } from "../shapes/Shape";
import { BsArrowDownSquare, BsArrowUpSquare } from 'react-icons/bs/';
import { shapeKeys, shapeListOption } from "src/shapes";
import { BsQuestionCircle } from 'react-icons/bs';

type shapeControlProps = {
  paramKey: string;
  param: ShapeParameterValue;
  onChange: (val: number) => void;
};

const DEBOUNCE_MS = 50;


let toutRef: string | number | NodeJS.Timeout | null | undefined = null;
const debounce = (cb: () => void, timeout: number) => {
  if (toutRef) clearTimeout(toutRef);
  toutRef = setTimeout(cb, timeout);
}

function ShapeControl({ paramKey, param, onChange }: shapeControlProps) {
  const changeHandler = (value: number) => {
    // console.log({ value });
    // debounce(() => {
    // console.log(Date.now());
    onChange(value);
    // }, DEBOUNCE_MS);
  }

  return (
    <Row className="controlGroup" key={paramKey}>
      <label title={param.tooltip || param.name} htmlFor={paramKey}>
        <OverlayTrigger
          delay={150}
          overlay={<Tooltip>{param.tooltip || param.name}</Tooltip>}
          placement="left">
          <><Badge style={{ cursor: 'help', marginRight: '.5em' }}><BsQuestionCircle /></Badge>{param.name}</>
        </OverlayTrigger>
      </label>

      <input size={5} type="number" min={param.min} max={param.max} value={param.value} step={param.step} onChange={(ev) => changeHandler(parseFloat(ev.currentTarget.value))} />
      <input id={paramKey} min={param.min} max={param.max} value={param.value} step={param.step} type="range" onChange={(ev) => changeHandler(parseFloat(ev.currentTarget.value))} />
    </Row >
  )
}

export type shapeControlsProps = {
  onParamChange: (paramKey: string, value: number) => void;
  controlsList: ShapeParameters;
  onShapeChange: (key: shapeKeys) => void;
  opts: shapeListOption[];
}

export function ShapeControls({ controlsList, onParamChange, onShapeChange, opts }: shapeControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  }

  const Controls = Object.keys(controlsList).map(key => (<ShapeControl key={key} paramKey={key} param={controlsList[key]} onChange={(v) => onParamChange(key, v)} />));

  return (
    <Container>
      <Row className="controlsTitle">
        Shape properties
        <ShapeSelector onChange={onShapeChange} options={opts} />
        {!collapsed ? <BsArrowDownSquare style={{ cursor: 'pointer' }} onClick={toggleCollapsed} /> : <BsArrowUpSquare style={{ cursor: 'pointer' }} onClick={toggleCollapsed} />}
      </Row>
      {!collapsed && Controls}
    </Container>
  )
}

type shapeSelectorProps = {
  onChange: (key: shapeKeys) => void;
  options: shapeListOption[];
}

function ShapeSelector({ onChange, options }: shapeSelectorProps) {
  const [selected, setSelected] = useState(0);
  // const Opts = options.map((v, i) => <option key={v.key} value={v.key}>{v.name}</option>);
  const btns = options.map((v, i) => (
    <Button
      variant={i === selected ? 'toggled' : undefined}
      onClick={(ev) => { setSelected(i); onChange(ev.currentTarget.value as shapeKeys) }}
      key={v.key}
      value={v.key}
    >{v.name}</Button >));


  return (
    <ButtonGroup>{btns}</ButtonGroup>
    // <Form.Select size="sm" onChange={(ev) => onChange(ev.currentTarget.value as shapeKeys)}>
    //   {Opts}
    // </Form.Select>
  )
}