import { Button, Container } from "react-bootstrap";
import { BsDownload } from "react-icons/bs";
import Shape from "../shapes/Shape"
import Drawing from 'dxf-writer';

type downloadBadgeProps = {
  shape: Shape | null;
}

export default function DownloadBadge({ shape }: downloadBadgeProps) {

  return (
    <Container id="downloadBadge">
      <Button onClick={() => shape && downloadAsDXF(shape)} disabled={shape === null}><BsDownload size="1.1em" />&nbsp;&nbsp;Download as DXF </Button>
    </Container>);
}

function downloadAsDXF(shape: Shape) {
  const d = new Drawing();
  d.setUnits('Millimeters');
  const fname = "drawing.dxf";

  const paths = shape.getPaths();
  paths.forEach((path, i) => {
    d.addLayer(`layer_${i}`, Drawing.ACI.GREEN, 'CONTINUOUS');
    d.setActiveLayer(`layer_${i}`);
    d.drawPolyline(path.points.map(p => [p.x, p.y]), false);
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(d.toDxfString()));
  element.setAttribute('download', fname);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

