#!/bin/bash

echo "================================="
echo "  Gestor de Inventario Web"
echo "================================="
echo ""

echo "Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo ""
echo "Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo ""
echo "================================="
echo "  Instalación completa!"
echo "================================="
echo ""
echo "Próximos pasos:"
echo "1. Configurar MySQL e importar schema.sql"
echo "2. Crear archivo backend/.env con credenciales"
echo "3. Ejecutar: cd backend && npm start"
echo "4. Ejecutar (en otra terminal): cd frontend && npm start"
echo ""

