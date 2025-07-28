import React, { useState, useEffect } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import { createVendor, updateVendor } from '../services/Api' // Sesuaikan path

const VendorForm = ({ visible, onClose, onSuccess, vendor }) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const isEditMode = !!vendor

  useEffect(() => {
    if (visible) {
      if (isEditMode) {
        setFormData({
          name: vendor.name || '',
          contact_person: vendor.contact_person || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          address: vendor.address || '',
          notes: vendor.notes || '',
        })
      } else {
        setFormData({ name: '', contact_person: '', email: '', phone: '', address: '', notes: '' })
      }
      setErrors({})
    }
  }, [visible, vendor, isEditMode])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      if (isEditMode) {
        await updateVendor(vendor.id, formData)
      } else {
        await createVendor(formData)
      }
      onSuccess()
      onClose()
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors)
      } else {
        alert('Terjadi kesalahan.')
      }
    }
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{isEditMode ? 'Edit Vendor' : 'Tambah Vendor Baru'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CFormInput
            className="mb-3"
            type="text"
            name="name"
            label="Nama Vendor"
            value={formData.name || ''}
            onChange={handleChange}
            required
            feedbackInvalid={errors.name}
            invalid={!!errors.name}
          />
          <CFormInput
            className="mb-3"
            type="text"
            name="contact_person"
            label="Contact Person"
            value={formData.contact_person || ''}
            onChange={handleChange}
          />
          <CFormInput
            className="mb-3"
            type="email"
            name="email"
            label="Email"
            value={formData.email || ''}
            onChange={handleChange}
            feedbackInvalid={errors.email}
            invalid={!!errors.email}
          />
          <CFormInput
            className="mb-3"
            type="text"
            name="phone"
            label="Nomor Telepon"
            value={formData.phone || ''}
            onChange={handleChange}
          />
          <CFormTextarea
            className="mb-3"
            name="address"
            label="Alamat"
            value={formData.address || ''}
            onChange={handleChange}
            rows={3}
          />
          <CFormTextarea
            className="mb-3"
            name="notes"
            label="Catatan"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={2}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Batal
          </CButton>
          <CButton color="primary" type="submit">
            Simpan
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default VendorForm
