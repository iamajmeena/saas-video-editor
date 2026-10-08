# Builds q1.html: my own onetake composition that REUSES ChatGPT's rebuilt editor UI (markup + css copied read-only from
# cg/cg_gradient_REFERENCE.html) with my own choreography (reveal -> progressive build -> torch-lit hops).
import re, io
src = io.open("cg/cg_gradient_REFERENCE.html", encoding="utf-8").read()
css = re.search(r"<style>(.*?)</style>", src, re.S).group(1)
# keep only the editor/inspector part of the CSS (.sl-ui, #editor, #inspector, #cursor) - drop ChatGPT's headline/footer/brand/body rules
keep = []
for line in css.split("\n"):
    if line.startswith(".sl-ui") or line.startswith("#editor") or line.startswith("#inspector") or line.startswith("#cursor"):
        keep.append(line)
ui_css = "\n".join(keep)
ed = re.search(r'(<div class="sl-ui" id="editor">.*?</section></div>)\s*<section class="sl-ui" id="inspector">', src, re.S)
editor_html = ed.group(1)
insp = re.search(r'(<section class="sl-ui" id="inspector">.*?</section>)\s*<div id="ring">', src, re.S).group(1)
editor_html = editor_html.replace('src="../assets/logo.svg"', 'src="cg/logo.svg"').replace('src="assets/recorded_content.jpg"', 'src="cg/recorded_content.jpg"')

tpl = io.open("q1_template.html", encoding="utf-8").read()
out = tpl.replace("/*UI_CSS*/", ui_css).replace("<!--EDITOR-->", editor_html).replace("<!--INSPECTOR-->", insp)
io.open("q1.html", "w", encoding="utf-8").write(out)
print("q1.html written", len(out))
