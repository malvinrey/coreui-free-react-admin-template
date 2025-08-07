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
import { getProducts, addStockToProduct } from '../../services/Api' // Sesuaikan path jika perlu
import { useNotifier } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'

const StockInPage = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().slice(0, 10))
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const { addToast } = useNotifier()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts()
        setProducts(response.data)
      } catch (err) {
        console.error('Gagal mengambil produk:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedProduct || !quantity || !receivedDate) {
      setError('Semua field harus diisi.')
      return
    }

    try {
      await addStockToProduct(selectedProduct, {
        quantity: parseInt(quantity, 10),
        received_date: receivedDate,
      })

      // Get product details for detailed notification
      const selectedProductData = products.find((p) => p.id.toString() === selectedProduct)
      const productName = selectedProductData ? selectedProductData.name : 'Unknown Product'
      const userName = user ? user.name || user.email : 'Unknown User'

      // Create detailed success message
      const successMessage = `${userName} berhasil menambahkan ${quantity} unit ${productName} ke stok`
      addToast(successMessage, 'success')

      // Reset form
      setSelectedProduct('')
      setQuantity('')
    } catch (err) {
      console.error('Gagal menambah stok:', err)

      // Get product details for detailed error message
      const selectedProductData = products.find((p) => p.id.toString() === selectedProduct)
      const productName = selectedProductData ? selectedProductData.name : 'Unknown Product'
      const userName = user ? user.name || user.email : 'Unknown User'

      // Create detailed error message
      const errorMessage = `${userName} gagal menambahkan ${quantity} unit ${productName} ke stok: ${err.response?.data?.message || 'Terjadi kesalahan'}`
      addToast(errorMessage, 'danger')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Penerimaan Barang / Tambah Stok</strong>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <p>Memuat daftar produk...</p>
            ) : (
              <CForm onSubmit={handleSubmit}>
                <div className="mb-3">
                  <CFormLabel htmlFor="productSelect">Pilih Produk</CFormLabel>
                  <CFormSelect
                    id="productSelect"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </CFormSelect>
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="quantityInput">Jumlah Diterima</CFormLabel>
                  <CFormInput
                    type="number"
                    id="quantityInput"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="mb-3">
                  <CFormLabel htmlFor="dateInput">Tanggal Diterima</CFormLabel>
                  <CFormInput
                    type="date"
                    id="dateInput"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
                <CButton type="submit" color="primary">
                  Tambah Stok
                </CButton>
              </CForm>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StockInPage
