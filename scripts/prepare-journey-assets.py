"""Deterministic crop/resize of already approved sheets; never calls generation.
Usage: python scripts/prepare-journey-assets.py --masters ../asset-masters/journey/masters
Requires Pillow. Outputs to a new preview folder, never overwrites production art.
"""
from pathlib import Path
from PIL import Image
import argparse
p=argparse.ArgumentParser();p.add_argument('--masters',type=Path,required=True);p.add_argument('--output',type=Path,default=Path('asset-preview'));a=p.parse_args()
if a.output.exists():p.error('Output exists; choose a new folder instead of overwriting.')
a.output.mkdir(parents=True)
s=Image.open(a.masters/'walk.png').convert('RGBA');w,h=s.size
frames=[]
for row in range(2):
    for col in range(4):
        c=s.crop((col*w//4,row*h//2,(col+1)*w//4,(row+1)*h//2));frames.append(c.crop(c.getchannel('A').getbbox()))
scale=min(232/max(f.width for f in frames),232/max(f.height for f in frames));strip=Image.new('RGBA',(2048,256))
for i,f in enumerate(frames):
    f=f.resize((round(f.width*scale),round(f.height*scale)),Image.Resampling.LANCZOS);strip.alpha_composite(f,(i*256+(256-f.width)//2,248-f.height))
strip.save(a.output/'pip-walk.webp',quality=85,method=6)
print('Preview written. Compare visually before promoting to assets/journey.')
