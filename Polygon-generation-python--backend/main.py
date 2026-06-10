"""
polygon-generation Python Service
=======================
FastAPI microservice that provides:
  - /geometrize   — convert an image to geometric primitives (SVG / JSON)
  - /palette      — extract dominant colours from an image
  - /unmix-color  — decompose a target colour into a set of source pigments

Proprietary algorithm implementations are intentionally omitted from this
sample; endpoint signatures and data-flow are shown for demonstration.
"""

from __future__ import annotations

import io
import os
from enum import Enum
from typing import List, Optional

import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel

app = FastAPI(title="polygon-generation Python API", version="1.0.0")

# ─── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constants ────────────────────────────────────────────────────────────────

SHAPE_TYPE_MAPPING = {
    "combo":             0,
    "triangle":          1,
    "rectangle":         2,
    "ellipse":           3,
    "circle":            3,
    "rotated_rectangle": 5,
    "bezier":            6,
    "rotated_ellipse":   7,
    "polygon":           8,
}

# ─── Pydantic models ──────────────────────────────────────────────────────────

class ShapeModel(BaseModel):
    """Single geometric primitive as returned by the geometrize engine."""
    type:  int
    data:  List[float]
    color: List[int]  # RGBA


class GeometrizeResponse(BaseModel):
    shapes:     List[ShapeModel]
    background: List[int]   # RGBA background colour
    width:      int
    height:     int


class PaletteColor(BaseModel):
    hex:   str
    rgb:   List[int]
    count: int     # approximate pixel coverage


class UnmixRequest(BaseModel):
    colors:      List[str]   # hex strings of available pigments
    targetColor: str         # hex string of the target colour


class UnmixResult(BaseModel):
    ratios: List[float]   # mixing ratio for each input colour (sums to 1.0)
    mixed:  str           # hex string of the predicted mixed result


# ─── Helpers ──────────────────────────────────────────────────────────────────

def load_image_from_upload(upload: UploadFile) -> Image.Image:
    """Read an uploaded file into a PIL Image (RGB)."""
    data = upload.file.read()
    return Image.open(io.BytesIO(data)).convert("RGB")


def image_to_numpy(image: Image.Image) -> np.ndarray:
    return np.array(image, dtype=np.uint8)


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/geometrize", response_model=GeometrizeResponse)
async def geometrize_image(
    file:             UploadFile = File(...),
    shape_types:      str        = Form("triangle"),   # comma-separated
    num_shapes:       int        = Form(200),
    computation_size: int        = Form(256),
    output_size:      int        = Form(512),
):
    """
    Convert an image to a JSON representation of geometric primitives.

    The returned `shapes` array can be replayed on an HTML5 Canvas to
    reconstruct a stylised version of the original image.

    NOTE: The core geometrize algorithm is proprietary and runs via a
    compiled binary invoked as a subprocess. This endpoint handles
    I/O, parameter mapping, and response shaping only.
    """
    try:
        image = load_image_from_upload(file)
        image = image.resize((computation_size, computation_size))

        shape_type_list = [s.strip() for s in shape_types.split(",")]
        shape_codes     = [SHAPE_TYPE_MAPPING[s] for s in shape_type_list
                           if s in SHAPE_TYPE_MAPPING]

        # ── Proprietary: invoke geometrize engine ──────────────────────────
        # result = run_geometrize(image, shape_codes, num_shapes)
        # ──────────────────────────────────────────────────────────────────
        result = {"shapes": [], "background": [255, 255, 255, 255]}   # placeholder

        return GeometrizeResponse(
            shapes=result["shapes"],
            background=result["background"],
            width=output_size,
            height=output_size,
        )
    except KeyError as exc:
        raise HTTPException(status_code=400, detail=f"Unknown shape type: {exc}") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Image processing failed") from exc


@app.post("/palette", response_model=List[PaletteColor])
async def extract_palette(
    file:        UploadFile = File(...),
    num_colors:  int        = Form(8),
    quality:     int        = Form(10),   # 1 = highest quality, higher = faster
):
    """
    Extract the dominant colour palette from an image.

    Uses a k-means clustering approach on downsampled pixel data.
    Returns colours sorted by approximate coverage (most dominant first).
    """
    image   = load_image_from_upload(file)
    pixels  = image_to_numpy(image.resize((150, 150)))  # downsample for speed

    # ── Proprietary: colour clustering ────────────────────────────────────
    # palette = cluster_colors(pixels, num_colors, quality)
    # ──────────────────────────────────────────────────────────────────────
    palette: list[PaletteColor] = []   # placeholder

    return palette


@app.post("/unmix-color", response_model=UnmixResult)
async def unmix_color(request: UnmixRequest):
    """
    Given a set of available pigment colours and a target colour, compute
    the mixing ratios required to approximate the target.

    This is the inverse of linear colour mixing and is solved as a
    constrained least-squares optimisation.

    NOTE: Proprietary solver implementation omitted from this sample.
    """
    # ── Proprietary: colour unmixing optimisation ─────────────────────────
    # ratios, mixed_hex = solve_unmix(request.colors, request.targetColor)
    # ──────────────────────────────────────────────────────────────────────
    return UnmixResult(ratios=[], mixed="#000000")   # placeholder


@app.get("/health")
async def health():
    return {"status": "ok"}
