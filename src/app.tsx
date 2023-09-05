import { Container } from "react-bootstrap";
import Canvas from "./components/Canvas";

export default function App() {
  return (
    <Container>
      <div>Top badge here</div>
      <div>Side bar here</div>

      <Canvas showGrid={true} size={800} />
      <div>Controls here</div>
      <div>Footer here</div>


    </Container>
  );
}
