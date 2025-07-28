import React, { useState, useEffect } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMinus, cilPlus } from '@coreui/icons'
import { getProducts, createStockOut } from '../../services/Api' // Sesuaikan path jika perlu

const StockOutPage = () => {
  const [allProducts, setAllProducts] = useState([])
  const [items, setItems] = useState([{ product_id: '', quantity: 1 }])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

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
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleAddItem = () => {
    setItems([...items, { product_id: '', quantity: 1 }])
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
      setSuccess('Transaksi pengeluaran barang berhasil!')
      setItems([{ product_id: '', quantity: 1 }])
      setNotes('')
    } catch (err) {
      console.error('Gagal mengeluarkan stok:', err)
      setError(
        err.response?.data?.errors?.items ||
          err.response?.data?.message ||
          'Gagal mengeluarkan stok.',
      )
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
                {items.map((item, index) => (
                  <CRow key={index} className="mb-2 align-items-center">
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
