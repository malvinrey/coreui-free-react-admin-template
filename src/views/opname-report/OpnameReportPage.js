import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOpnameSession } from '../../services/Api'
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
} from '@coreui/react'

const OpnameReportPage = () => {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getOpnameSession(id)
        setSession(response.data)
      } catch (error) {
        console.error('Gagal mengambil data sesi opname:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [id])

  if (loading) return <p>Memuat laporan...</p>
  if (!session) return <p>Laporan sesi tidak ditemukan.</p>

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Detail Laporan Stock Opname #{session.id}</strong>
            <div className="float-end">
              <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
                Cetak Laporan
              </button>
            </div>
          </CCardHeader>
          <CCardBody>
            <p>
              <strong>Status:</strong> {session.status}
            </p>
            <p>
              <strong>Tanggal Mulai:</strong> {new Date(session.start_date).toLocaleString()}
            </p>
            <p>
              <strong>Tanggal Selesai:</strong>{' '}
              {session.end_date ? new Date(session.end_date).toLocaleString() : '-'}
            </p>
            <p>
              <strong>Dibuat Oleh:</strong> {session.user?.name || 'N/A'}
            </p>
            <CTable align="middle" className="mb-0 border mt-4" hover responsive>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Produk</CTableHeaderCell>
                  <CTableHeaderCell>Stok Sistem</CTableHeaderCell>
                  <CTableHeaderCell>Stok Fisik (Hitungan)</CTableHeaderCell>
                  <CTableHeaderCell>Selisih (Variance)</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {session.details.map((detail) => (
                  <CTableRow key={detail.id}>
                    <CTableDataCell>{detail.product.name}</CTableDataCell>
                    <CTableDataCell>{detail.system_stock_at_opname}</CTableDataCell>
                    <CTableDataCell>{detail.counted_stock}</CTableDataCell>
                    <CTableDataCell>{detail.variance}</CTableDataCell>
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

export default OpnameReportPage
