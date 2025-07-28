import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, startNewOpname } from '../../services/Api' // Sesuaikan path jika perlu
import {
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
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'

const Dashboard = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        setProducts(response.data)
      } catch (error) {
        console.error('Gagal mengambil data produk:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleStartOpname = async () => {
    if (window.confirm('Anda yakin ingin memulai sesi stock opname baru?')) {
      try {
        const response = await startNewOpname()
        const newOpnameSession = response.data
        if (newOpnameSession && newOpnameSession.id) {
          alert('Sesi opname baru berhasil dibuat!')
          navigate(`/opname/${newOpnameSession.id}`)
        } else {
          alert('Gagal mendapatkan ID sesi baru dari server.')
        }
      } catch (error) {
        alert('Gagal memulai sesi opname baru.')
        console.error(error)
      }
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Daftar Produk</strong>
              <div className="float-end">
                <CButton color="primary" size="sm" onClick={handleStartOpname}>
                  <CIcon icon={cilPlus} className="me-2" />
                  Mulai Stock Opname
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <p>Memuat data produk...</p>
              ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell>SKU</CTableHeaderCell>
                      <CTableHeaderCell>Nama Produk</CTableHeaderCell>
                      <CTableHeaderCell>Total Stok Sistem</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {products.map((product) => (
                      <CTableRow v-for="item in tableItems" key={product.id}>
                        <CTableDataCell>
                          <div>{product.sku}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{product.name}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <strong>{product.total_stock}</strong>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
