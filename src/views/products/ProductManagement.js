import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import { getProducts, getVendors, deleteProduct } from '../../services/Api' // 1. Import getVendors
import ProductForm from '../../components/ProductForm' // Pastikan path ini sesuai

const ProductManagementPage = () => {
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([]) // State untuk menyimpan daftar vendor
  const [visible, setVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Ganti nama fungsi agar lebih jelas
  const fetchData = async () => {
    try {
      const [productsResponse, vendorsResponse] = await Promise.all([getProducts(), getVendors()])
      setProducts(productsResponse.data)
      setVendors(vendorsResponse.data)
    } catch (error) {
      console.error('Gagal mengambil data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAdd = () => {
    setSelectedProduct(null)
    setVisible(true)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setVisible(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteProduct(id)
        fetchData() // Refresh data
      } catch (error) {
        alert(error.response?.data?.message || 'Gagal menghapus produk.')
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Manajemen Produk</strong>
            <div className="float-end">
              <CButton color="primary" size="sm" onClick={handleAdd}>
                <CIcon icon={cilPlus} className="me-2" />
                Tambah Produk
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {/* 2. Hapus semua logika dan JSX Modal dari sini */}
            {/* Ganti dengan memanggil komponen ProductForm */}
            <ProductForm
              visible={visible}
              onClose={() => setVisible(false)}
              onSuccess={fetchData}
              product={selectedProduct}
              vendors={vendors} // 3. Teruskan daftar vendor ke komponen Form
            />

            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>SKU</CTableHeaderCell>
                  <CTableHeaderCell>Nama Produk</CTableHeaderCell>
                  <CTableHeaderCell>Vendor</CTableHeaderCell>
                  <CTableHeaderCell>Stok Total</CTableHeaderCell>
                  <CTableHeaderCell>Batas Min. Stok</CTableHeaderCell>
                  <CTableHeaderCell>Aksi</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {products.map((product) => (
                  <CTableRow key={product.id}>
                    <CTableDataCell>{product.sku}</CTableDataCell>
                    <CTableDataCell>{product.name}</CTableDataCell>
                    <CTableDataCell>{product.vendor ? product.vendor.name : 'N/A'}</CTableDataCell>
                    <CTableDataCell>{product.total_stock}</CTableDataCell>
                    <CTableDataCell>{product.min_stock_level}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" size="sm" onClick={() => handleEdit(product)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleDelete(product.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductManagementPage
