import sys, pathlib
from playwright.sync_api import sync_playwright
here = pathlib.Path(__file__).parent.resolve()
jobs = [a.split(":") for a in sys.argv[1:]]     # comp:t_rel:out.png
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1080, "height": 1920})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    for comp, t, out in jobs:
        pg.goto((here / comp).as_uri() + "?t=" + t)
        pg.wait_for_function("window.__ready !== undefined")
        pg.evaluate("window.__ready")
        pg.evaluate(f"window.__seek({t})")
        pg.wait_for_timeout(250)
        pg.screenshot(path=str(here / out))
    print("errors:", errs)
    b.close()
