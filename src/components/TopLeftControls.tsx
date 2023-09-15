
import { Container, Row, Badge } from "react-bootstrap";
import { BsMoon, BsSun } from "react-icons/bs";
import GHBadge from "./GHBadge";


export default function TopLeftControls() {
  return (
    <Container id="topControls">
      <Row>
        <ThemeChanger />
        <About />
        <GHBadge />
      </Row>
    </Container>
  );
}

function About() {
  return (
    <Badge>About</Badge>
  )
}

function ThemeChanger() {
  return (
    <>
      <BsMoon />
      <BsSun />
    </>
  )
}