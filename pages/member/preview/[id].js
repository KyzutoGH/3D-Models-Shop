import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Loader } from 'lucide-react';

export default function ModelPreview() {
  const router = useRouter();
  const { id } = router.query;
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);
  
  // Tambahkan format FBX ke daftar format yang ditangani
  const supportedFormats = ['glb', 'gltf', 'fbx'];
  
  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const checkFileFormat = (path) => {
    if (!path) return null;
    const extension = path.split('.').pop().toLowerCase();
    return extension;
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const data = await res.json();
      setProduct(data);
      
      // Ubah logika pengecekan preview_path
      const modelPath = data.preview_path || `/uploads/model-${id}.fbx`;
      initializeViewer(modelPath);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const initializeViewer = async (modelPath) => {
    try {
      const fileFormat = checkFileFormat(modelPath);
      
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Tampilkan preview untuk semua format termasuk FBX
      const previewContainer = document.createElement('div');
      previewContainer.className = 'flex flex-col items-center justify-center w-full h-full bg-gray-100';
      
      const previewImage = document.createElement('div');
      previewImage.className = 'mb-4 p-8 bg-white rounded-lg shadow-sm flex flex-col items-center';
      previewImage.innerHTML = `
        <div class="mb-4">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               class="text-gray-400">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        </div>
        <p class="text-lg font-semibold text-gray-700">Model 3D</p>
        <p class="text-gray-500 mt-2">Format: ${fileFormat.toUpperCase()}</p>
      `;

      previewContainer.appendChild(previewImage);
      containerRef.current.appendChild(previewContainer);
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing viewer:', error);
      setError('Failed to initialize 3D viewer');
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.resetTurntable();
      viewerRef.current.cameraOrbit = '0deg 75deg 105%';
    }
  };

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const currentRadius = viewerRef.current.getCameraOrbit().radius;
      viewerRef.current.cameraOrbit = `auto auto ${currentRadius * 0.8}`;
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const currentRadius = viewerRef.current.getCameraOrbit().radius;
      viewerRef.current.cameraOrbit = `auto auto ${currentRadius * 1.2}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>

        {product && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative" style={{ height: '70vh' }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                  <Loader className="w-8 h-8 animate-spin text-blue-500" />
                  <p className="mt-2 text-gray-600">Loading model...</p>
                </div>
              </div>
            )}

            <div ref={containerRef} className="w-full h-full" />
          </div>
        </div>

        {product && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Spesifikasi Model</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Format: <span className="font-semibold">{product.format || 'FBX'}</span></p>
                <p className="text-gray-600">Polygon Count: <span className="font-semibold">{product.polygon_count || '-'}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Textures: <span className="font-semibold">{product.textures || '-'}</span></p>
                <p className="text-gray-600">Rigged: <span className="font-semibold">{product.rigged || '-'}</span></p>
              </div>
            </div>
            {product.specifications && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Spesifikasi Tambahan:</h3>
                <p className="text-gray-600">{product.specifications}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}