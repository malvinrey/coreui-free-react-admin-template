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
import { getVendors, deleteVendor } from '../../services/Api' // Sesuaikan path jika perlu
import VendorForm from '../../components/VendorForm' // Sesuaikan path jika perlu

const VendorManagementPage = () => {
  const [vendors, setVendors] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchVendors = async () => {
    try {
      const response = await getVendors()
      setVendors(response.data)
    } catch (error) {
      console.error('Gagal mengambil data vendor:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const handleAdd = () => {
    setSelectedVendor(null)
    setIsFormOpen(true)
  }

  const handleEdit = (vendor) => {
    setSelectedVendor(vendor)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Anda yakin ingin menghapus vendor ini?')) {
      try {
        await deleteVendor(id)
        alert('Vendor berhasil dihapus.')
        fetchVendors()
      } catch (error) {
        console.error('Gagal menghapus vendor:', error)
        alert('Gagal menghapus vendor.')
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        {/* 1. Gunakan CCard sebagai pembungkus utama */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Manajemen Vendor / Supplier</strong>
            <div className="float-end">
              <CButton color="primary" size="sm" onClick={handleAdd}>
                <CIcon icon={cilPlus} className="me-2" />
                Tambah Vendor
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {isFormOpen && (
              <VendorForm
                visible={isFormOpen} // Pass 'visible' prop to modal
                vendor={selectedVendor}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchVendors}
              />
            )}

            {loading ? (
              <p>Memuat data vendor...</p>
            ) : (
              // 2. Struktur Tabel diperbaiki
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Nama Vendor</CTableHeaderCell>
                    <CTableHeaderCell>Contact Person</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Telepon</CTableHeaderCell>
                    <CTableHeaderCell>Alamat</CTableHeaderCell>
                    <CTableHeaderCell>Catatan</CTableHeaderCell>
                    <CTableHeaderCell>Aksi</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {vendors.map((vendor) => (
                    <CTableRow key={vendor.id}>
                      <CTableDataCell>{vendor.name}</CTableDataCell>
                      <CTableDataCell>{vendor.contact_person}</CTableDataCell>
                      <CTableDataCell>{vendor.email}</CTableDataCell>
                      <CTableDataCell>{vendor.phone}</CTableDataCell>
                      <CTableDataCell>{vendor.address}</CTableDataCell>
                      <CTableDataCell>{vendor.notes}</CTableDataCell>
                      <CTableDataCell>
                        {/* 3. Styling tombol aksi */}
                        <CButton color="info" size="sm" onClick={() => handleEdit(vendor)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleDelete(vendor.id)}
                        >
                          <CIcon icon={cilTrash} />
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

export default VendorManagementPage
