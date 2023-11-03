
import { useContext, useState } from "react";
import { Container, Badge } from "react-bootstrap";
import { BsMoon, BsSun } from "react-icons/bs";
import { ThemeContext } from "src/providers/theme";

import AboutModal from "./AboutModal";
import GHBadge from "./GHBadge";


export function TopRightBar() {
  return (
    <Container id="topControls">

      <ThemeChanger />
      <About />
      <GHBadge />

    </Container>
  );
}

function About() {
  const [showAbout, setShowAbout] = useState(false);


  return (
    <>
      <Badge className="aboutBadge" onClick={() => setShowAbout(!showAbout)}>About</Badge>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  )
}

function ThemeChanger() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    (theme === 'dark') ? setTheme('light') : setTheme('dark');
  }

  return (
    <Badge className="themeChanger" onClick={() => toggleTheme()}>
      Theme:
      <span className={(theme === 'dark') ? 'selected' : ''}> <BsMoon /></span >
      <span className={(theme === 'light') ? 'selected' : ''} ><BsSun /></span>
    </Badge>
  )
}