import React, { useState, useEffect } from 'react'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CFormInput,
  CFormTextarea,
} from '@coreui/react'
import { createProduct, updateProduct } from '../services/Api' // Sesuaikan path

// 1. Terima 'vendors' sebagai props
const ProductForm = ({ visible, onClose, onSuccess, product, vendors }) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const isEditMode = !!product

  useEffect(() => {
    if (visible) {
      if (isEditMode) {
        setFormData({
          name: product.name,
          sku: product.sku,
          description: product.description || '',
          vendor_id: product.vendor_id || '',
        })
      } else {
        // Reset form untuk mode 'create'
        setFormData({ name: '', sku: '', description: '', vendor_id: '' })
      }
      setErrors({})
    }
  }, [visible, product, isEditMode])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    try {
      if (isEditMode) {
        await updateProduct(product.id, formData)
      } else {
        await createProduct(formData)
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
        <CModalTitle>{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</CModalTitle>
      </CModalHeader>
      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CFormInput
            type="text"
            name="name"
            label="Nama Produk"
            value={formData.name || ''}
            onChange={handleChange}
            required
            feedbackInvalid={errors.name}
            invalid={!!errors.name}
            className="mb-3"
          />
          <CFormInput
            type="text"
            name="sku"
            label="SKU"
            value={formData.sku || ''}
            onChange={handleChange}
            required
            feedbackInvalid={errors.sku}
            invalid={!!errors.sku}
            className="mb-3"
          />
          {/* 2. Logika dropdown vendor sekarang akan berfungsi */}
          <CFormSelect
            name="vendor_id"
            label="Vendor"
            value={formData.vendor_id || ''}
            onChange={handleChange}
            className="mb-3"
            feedbackInvalid={errors.vendor_id}
            invalid={!!errors.vendor_id}
          >
            <option value="">-- Pilih Vendor (Opsional) --</option>
            {vendors &&
              vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
          </CFormSelect>

          <CFormTextarea
            name="description"
            label="Deskripsi"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
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

export default ProductForm
