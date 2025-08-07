import React from 'react'
import { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMinus, cilPlus } from '@coreui/icons'
import { getProducts, createStockOut } from '../../services/Api' // Sesuaikan path jika perlu
import { useNotifier } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'

const StockOutPage = () => {
  const [allProducts, setAllProducts] = useState([])
  const [items, setItems] = useState([{ product_id: '', quantity: 1, info: null }])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useNotifier()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        setAllProducts(response.data)
      } catch (err) {
        console.error('Gagal mengambil produk:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleItemChange = (index, field, value) => {
    // Buat salinan baru dari array items
    const newItems = items.map((item, i) => {
      if (index === i) {
        // Update field yang berubah
        const updatedItem = { ...item, [field]: value }

        // Jika produk berubah, update juga info stoknya
        if (field === 'product_id') {
          const product = allProducts.find((p) => p.id.toString() === value)
          updatedItem.info = product || null
        }
        return updatedItem
      }
      return item
    })
    // Hanya panggil setItems satu kali
    setItems(newItems)
  }

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1, info: null }])
  }

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validItems = items.filter((item) => item.product_id && item.quantity > 0)

    if (validItems.length === 0) {
      setError('Harap tambahkan setidaknya satu produk yang valid.')
      return
    }

    try {
      await createStockOut({ notes, items: validItems })

      // Create detailed success message
      const userName = user ? user.name || user.email : 'Unknown User'
      const itemDetails = validItems
        .map((item) => {
          const product = allProducts.find((p) => p.id.toString() === item.product_id)
          return `${item.quantity} unit ${product ? product.name : 'Unknown Product'}`
        })
        .join(', ')

      const successMessage = `${userName} berhasil mengeluarkan ${itemDetails} dari stok${notes ? ` (${notes})` : ''}`
      addToast(successMessage, 'success')

      // Reset form
      setItems([{ product_id: '', quantity: 1, info: null }])
      setNotes('')
    } catch (err) {
      console.error('Gagal mengeluarkan stok:', err)

      // Create detailed error message
      const userName = user ? user.name || user.email : 'Unknown User'
      const itemDetails = validItems
        .map((item) => {
          const product = allProducts.find((p) => p.id.toString() === item.product_id)
          return `${item.quantity} unit ${product ? product.name : 'Unknown Product'}`
        })
        .join(', ')

      const errorDetails =
        err.response?.data?.errors?.items || err.response?.data?.message || 'Terjadi kesalahan'

      const errorMessage = `${userName} gagal mengeluarkan ${itemDetails} dari stok: ${errorDetails}`
      addToast(errorMessage, 'danger')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Pengeluaran Barang / Penjualan (Multi-Produk)</strong>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Memuat daftar produk...</p>
            ) : (
              <CForm onSubmit={handleSubmit}>
                <CFormLabel>Item Barang</CFormLabel>

                {/* Perbaikan struktur map */}
                {items.map((item, index) => (
                  <div key={index}>
                    {' '}
                    {/* Bungkus setiap baris item dalam <div> */}
                    <CRow className="mb-2 align-items-center">
                      <CCol md={6}>
                        <CFormSelect
                          value={item.product_id}
                          onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                          required
                        >
                          <option value="">-- Pilih Produk --</option>
                          {allProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (Stok: {product.total_stock})
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormInput
                          type="number"
                          placeholder="Jumlah"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="1"
                          required
                        />
                      </CCol>
                      <CCol md={3}>
                        {items.length > 1 && (
                          <CButton color="danger" onClick={() => handleRemoveItem(index)}>
                            <CIcon icon={cilMinus} /> Hapus
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                    {/* LOGIKA PERINGATAN */}
                    {item.info && item.info.total_stock <= item.info.min_stock_level && (
                      <CAlert color="warning" className="mt-1 mb-3">
                        Peringatan: Stok produk ini ({item.info.total_stock}) sudah mencapai atau di
                        bawah batas minimum ({item.info.min_stock_level}).
                      </CAlert>
                    )}
                  </div>
                ))}

                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={handleAddItem}
                  className="mt-2"
                >
                  <CIcon icon={cilPlus} /> Tambah Item
                </CButton>

                <div className="mt-4">
                  <CFormLabel htmlFor="notesInput">Catatan (Opsional)</CFormLabel>
                  <CFormInput
                    type="text"
                    id="notesInput"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Penjualan ke PT. ABC"
                  />
                </div>

                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">{success}</p>}
                <CButton type="submit" color="primary" className="mt-4">
                  Proses Pengeluaran Stok
                </CButton>
              </CForm>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StockOutPage
