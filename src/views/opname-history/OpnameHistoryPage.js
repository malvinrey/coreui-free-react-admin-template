import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { cilSearch } from '@coreui/icons'
import { getOpnameSessions } from '../../services/Api' // Anda perlu membuat fungsi ini di Api.js

const OpnameHistoryPage = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getOpnameSessions() // Panggil API untuk mengambil riwayat
        setSessions(response.data.data) // Sesuaikan jika API Anda menggunakan paginasi
      } catch (error) {
        console.error('Gagal mengambil riwayat opname:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  const viewDetails = (id) => {
    // Arahkan ke halaman detail laporan opname (yang akan kita buat selanjutnya)
    navigate(`/opname-report/${id}`)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Riwayat Stock Opname</strong>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Memuat riwayat...</p>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>ID Sesi</CTableHeaderCell>
                    <CTableHeaderCell>Tanggal Mulai</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Dibuat Oleh</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sessions.map((session) => (
                    <CTableRow key={session.id}>
                      <CTableDataCell>#{session.id}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(session.start_date).toLocaleString()}
                      </CTableDataCell>
                      <CTableDataCell>{session.status}</CTableDataCell>
                      <CTableDataCell>{session.user?.name || 'N/A'}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="info" size="sm" onClick={() => viewDetails(session.id)}>
                          <CIcon icon={cilSearch} className="me-2" />
                          Lihat Detail
                        </CButton>
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
  )
}

export default OpnameHistoryPage
