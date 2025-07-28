import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOpnameSession, updateOpnameDetail, completeOpnameSession } from '../../services/Api' // Pastikan path ini benar
import { debounce } from 'lodash'

// 1. Impor semua komponen CoreUI yang digunakan
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

const StockOpnamePage = () => {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getOpnameSession(id)
        setSession(response.data)
        setDetails(response.data.details)
      } catch (error) {
        console.error('Gagal mengambil data sesi opname:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [id])

  const debouncedSave = useMemo(
    () =>
      debounce(async (productId, countedStock) => {
        try {
          await updateOpnameDetail(id, { product_id: productId, counted_stock: countedStock })
          console.log(`Tersimpan: produk ${productId} dengan jumlah ${countedStock}`)
        } catch (error) {
          console.error(`Gagal menyimpan produk ${productId}:`, error)
        }
      }, 1000),
    [id],
  )

  const handleCountChange = useCallback(
    (productId, value) => {
      const newDetails = details.map((d) => {
        if (d.product_id === productId) {
          const counted = parseInt(value, 10) || 0
          return { ...d, counted_stock: counted, variance: counted - d.system_stock_at_opname }
        }
        return d
      })
      setDetails(newDetails)
      debouncedSave(productId, parseInt(value, 10) || 0)
    },
    [details, debouncedSave],
  )

  const handleCompleteOpname = async () => {
    if (
      window.confirm(
        'Anda yakin ingin menyelesaikan dan finalisasi sesi opname ini? Stok akan disesuaikan.',
      )
    ) {
      try {
        await completeOpnameSession(id)
        alert('Sesi opname berhasil diselesaikan!')
        navigate('/') // Kembali ke dashboard
      } catch (error) {
        alert('Gagal menyelesaikan sesi opname.')
        console.error(error)
      }
    }
  }

  if (loading) return <p>Loading...</p>
  if (!session) return <p>Sesi tidak ditemukan.</p>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Stock Opname Sesi #{session.id}</strong>
            <span className="float-end">Status: {session.status}</span>
          </CCardHeader>
          <CCardBody>
            {/* 2. Struktur tabel diperbaiki */}
            <CTable align="middle" className="mb-0 border" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Produk</CTableHeaderCell>
                  <CTableHeaderCell>Stok Sistem</CTableHeaderCell>
                  <CTableHeaderCell>Stok Fisik (Hitungan)</CTableHeaderCell>
                  <CTableHeaderCell>Selisih</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {details.map((detail) => (
                  <CTableRow key={detail.id}>
                    <CTableDataCell>{detail.product.name}</CTableDataCell>
                    <CTableDataCell>{detail.system_stock_at_opname}</CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        type="number"
                        value={detail.counted_stock}
                        onChange={(e) => handleCountChange(detail.product_id, e.target.value)}
                        disabled={session.status === 'completed'}
                      />
                    </CTableDataCell>
                    <CTableDataCell>{detail.variance}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <div className="border-top my-3"></div>
            <CButton
              onClick={handleCompleteOpname}
              disabled={session.status === 'completed'}
              color="primary"
            >
              Selesaikan & Finalisasi Opname
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StockOpnamePage
