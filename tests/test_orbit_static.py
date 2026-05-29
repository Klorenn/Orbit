from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "Orbit.html"
CSS = ROOT / "orbit.css"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


class OrbitStaticPageTest(unittest.TestCase):
    def test_orbit_page_and_stylesheet_exist(self):
        self.assertTrue(HTML.exists(), "Orbit.html should be implemented at the project root")
        self.assertTrue(CSS.exists(), "orbit.css should be implemented at the project root")

    def test_orbit_page_uses_expected_design_sections_and_assets(self):
        html = read(HTML)

        self.assertIn('<link rel="stylesheet" href="orbit.css"', html)
        self.assertIn("Orbit — Filecoin Governance Forum", html)
        self.assertIn("A constellation of voices, building Filecoin together.", html)
        self.assertIn("The Filecoin ambassador forum", html)
        self.assertIn("Connect Wallet to Join", html)
        self.assertIn("Meet Orbit.", html)
        self.assertIn("Visible work, finally", html)
        self.assertIn("How it works", html)
        self.assertIn("Voices from the constellation.", html)
        self.assertIn("Ready to add your voice?", html)
        self.assertIn("pingPong(document.getElementById('heroVideo'))", html)
        self.assertIn('<span class="name">Olga</span><br><span class="city">Lima, Peru</span>', html)

        for asset in [
            "assets/hero.mp4",
            "assets/hero-poster.png",
            "assets/hero-end.png",
            "assets/space.png",
            "assets/blue.png",
            "assets/yellow.png",
            "assets/purple.png",
            "assets/greenplanet.png",
            "assets/red.png",
            "assets/orbit-cta-reference.png",
        ]:
            self.assertIn(asset, html)
            self.assertTrue((ROOT / asset).exists(), f"Missing design asset: {asset}")

    def test_orbit_css_contains_fintech_bento_and_responsive_rules(self):
        css = read(CSS)

        self.assertIn("--bg: #F5F5F5", css)
        self.assertIn("--blue: #0090FF", css)
        self.assertIn("Hanken Grotesk", css)
        self.assertIn(".hero-wrap", css)
        self.assertIn(".hero-card", css)
        self.assertIn(".bento", css)
        self.assertIn(".cell.scene", css)
        self.assertIn(".intro-astro", css)
        self.assertIn(".astro-mid", css)
        self.assertIn("@media (max-width: 980px)", css)
        self.assertIn("@media (prefers-reduced-motion: reduce)", css)

    def test_meet_orbit_matches_compact_reference_scale(self):
        html = read(HTML)
        css = read(CSS)

        self.assertIn('class="astro-red"', html)
        self.assertIn('src="assets/bluekey.png"', html)
        self.assertIn('src="assets/greenplanet.png"', html)
        self.assertTrue((ROOT / "assets/greenplanet.png").exists())
        self.assertIn(".section#meet { padding-block: 52px 38px; }", css)
        self.assertIn("#meet .inner { max-width: 1086px; }", css)
        self.assertIn("#meet .h2 { font-size: 48px; line-height: 1; white-space: nowrap; }", css)
        self.assertIn(".intro-row.has-astros {", css)
        self.assertIn("grid-template-columns: 220px 310px 364px 150px;", css)
        self.assertIn("height: 176px;", css)
        self.assertIn(".intro-row.has-astros .intro-left { padding-top: 24px; }", css)
        self.assertIn(".astro-red { width: 150px;", css)
        self.assertIn(".cell.scene { color: #fff; min-height: 326px; padding: 0; }", css)
        self.assertIn(".key-astro { width: 205px;", css)
        self.assertIn(".planet-astro { width: 185px;", css)

    def test_hero_content_has_no_javascript_visibility_dependency(self):
        css = read(CSS)

        self.assertIn(".hero .reveal { opacity: 1; transform: none; }", css)

    def test_join_cta_matches_orbit_reference_with_wallet_button(self):
        html = read(HTML)
        css = read(CSS)

        self.assertIn('class="orbit-cta-image reveal"', html)
        self.assertIn('src="assets/orbit-cta-reference.png"', html)
        self.assertIn('class="btn btn-arrow on-light orbit-image-wallet"', html)
        for label in ["REPORT", "PROPOSE", "RESEARCH", "CONNECT", "DEBATE"]:
            self.assertIn(label, html)

        self.assertIn(".orbit-cta-image {", css)
        self.assertIn("aspect-ratio: 1536 / 1024;", css)
        self.assertIn(".orbit-cta-image > img {", css)
        self.assertIn(".orbit-image-wallet {", css)
        self.assertIn("top: 67.5%;", css)


if __name__ == "__main__":
    unittest.main()
