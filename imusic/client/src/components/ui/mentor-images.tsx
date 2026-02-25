import React from 'react';
import kendrickLamarImage from '../../assets/kendrick-lamar-image.png';
import kendrickFlowCard from '../../assets/kendrick-flow-card.png';

// This component provides mentor images using direct <img> elements with imported assets
// This approach avoids the Content-Type header issues seen with background-image URLs

export const KendrickFlowUI: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <img 
      src={kendrickLamarImage} 
      alt="Kendrick Flow" 
      className={props.className} 
      style={props.style}
    />
  );
};

export const KendrickFlowImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <img 
      src={kendrickFlowCard} 
      alt="Kendrick Flow" 
      className={props.className} 
      style={props.style}
    />
  );
};

export const NovaRaeImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <div className={props.className} style={{
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExMDFmIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI4MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI2MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI0MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPHBhdGggZD0iTTE2MCwyMjAgQzE2MCwxODAgMjQwLDE4MCAyNDAsMjIwIEwyNDAsMjgwIEMxNjAsMjgwIDE2MCwyODAgMTYwLDIyMCBaIiBmaWxsPSIjYTc4YmZmIiBvcGFjaXR5PSIwLjMiIC8+CiAgICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhNzhiZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMSwzIiAvPgogICAgPHRleHQgeD0iNTAlIiB5PSIzMDAiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5OUjwvdGV4dD4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iMzQwIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYTc4YmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+Tm92YSBSYWU8L3RleHQ+Cjwvc3ZnPg==')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...props.style,
    }} />
  );
};

export const MetroDeepImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <div className={props.className} style={{
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExMDFmIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI4MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI2MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI0MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPHBhdGggZD0iTTE2MCwyMjAgQzE2MCwxODAgMjQwLDE4MCAyNDAsMjIwIEwyNDAsMjgwIEMxNjAsMjgwIDE2MCwyODAgMTYwLDIyMCBaIiBmaWxsPSIjYTc4YmZmIiBvcGFjaXR5PSIwLjMiIC8+CiAgICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhNzhiZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMSwzIiAvPgogICAgPHRleHQgeD0iNTAlIiB5PSIzMDAiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5NRDwvdGV4dD4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iMzQwIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYTc4YmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TWV0cm8gRGVlcDwvdGV4dD4KPC9zdmc+')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...props.style,
    }} />
  );
};

export const Blaze420Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <div className={props.className} style={{
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExMDFmIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI4MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI2MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI0MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPHBhdGggZD0iTTE2MCwyMjAgQzE2MCwxODAgMjQwLDE4MCAyNDAsMjIwIEwyNDAsMjgwIEMxNjAsMjgwIDE2MCwyODAgMTYwLDIyMCBaIiBmaWxsPSIjYTc4YmZmIiBvcGFjaXR5PSIwLjMiIC8+CiAgICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhNzhiZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMSwzIiAvPgogICAgPHRleHQgeD0iNTAlIiB5PSIzMDAiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5CNDIwPC90ZXh0PgogICAgPHRleHQgeD0iNTAlIiB5PSIzNDAiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNhNzhiZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5CbGF6ZSA0MjA8L3RleHQ+Cjwvc3ZnPg==')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...props.style,
    }} />
  );
};

export const IvyMuseImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return (
    <div className={props.className} style={{
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWExMDFmIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI4MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI2MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTYwIiByPSI0MCIgZmlsbD0iI2E3OGJmZiIgb3BhY2l0eT0iMC4yIiAvPgogICAgPHBhdGggZD0iTTE2MCwyMjAgQzE2MCwxODAgMjQwLDE4MCAyNDAsMjIwIEwyNDAsMjgwIEMxNjAsMjgwIDE2MCwyODAgMTYwLDIyMCBaIiBmaWxsPSIjYTc4YmZmIiBvcGFjaXR5PSIwLjMiIC8+CiAgICA8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNjAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiNhNzhiZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iMSwzIiAvPgogICAgPHRleHQgeD0iNTAlIiB5PSIzMDAiIGZvbnQtc2l6ZT0iMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5JTTwvdGV4dD4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iMzQwIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYTc4YmZmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+SXZ5IE11c2U8L3RleHQ+Cjwvc3ZnPg==')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      ...props.style,
    }} />
  );
};