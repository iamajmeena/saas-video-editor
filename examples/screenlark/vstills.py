import argparse, asyncio, io, os
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
async def main():
    ap = argparse.ArgumentParser(); ap.add_argument("comp"); ap.add_argument("--times", required=True); ap.add_argument("--out", default="stills.png")
    ap.add_argument("--tw", type=int, default=360); ap.add_argument("--cols", type=int, default=6)
    a = ap.parse_args(); ts = [float(x) for x in a.times.split(",")]; th = a.tw*16//9
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={"width":1080,"height":1920})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto("file:///"+os.path.abspath(a.comp).replace("\\","/")); await pg.evaluate("window.__ready")
        tiles=[]
        for t in ts:
            await pg.evaluate(f"window.__seek({t})"); await pg.wait_for_timeout(40)
            raw=Image.open(io.BytesIO(await pg.screenshot()))
            if len(ts)==1: raw.save(a.out); print("saved full",a.out); break
            im=raw.resize((a.tw,th)); ImageDraw.Draw(im).text((6,6),f"t={t}",fill=(255,255,0)); tiles.append(im)
        await b.close()
    if tiles:
        rows=(len(tiles)+a.cols-1)//a.cols; sh=Image.new("RGB",(a.tw*a.cols,th*rows))
        for i,im in enumerate(tiles): sh.paste(im,((i%a.cols)*a.tw,(i//a.cols)*th))
        sh.save(a.out)
    print("errors:", errs[:5] or "none")
asyncio.run(main())
