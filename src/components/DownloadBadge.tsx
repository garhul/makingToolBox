import { Button, Container } from "react-bootstrap";
import { BsDownload } from "react-icons/bs";
import { Shape } from "src/types"
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
  const points = shape.getPoints();
  const fname = "Test.dxf";

  d.setUnits('Millimeters');
  d.addLayer('part', Drawing.ACI.GREEN, 'CONTINUOUS');
  d.setActiveLayer('part');

  d.drawPolyline(points.map(p => [p.x, p.y]), true);
  console.log(d.toDxfString());

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(d.toDxfString()));
  element.setAttribute('download', fname);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

