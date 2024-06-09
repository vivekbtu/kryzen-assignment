import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import ProductList from './ProductList';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import './ProductPage.css';
import { useToast } from '@chakra-ui/react';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [scheduleTime, setScheduleTime] = useState('');
    const [isSortedByTime, setIsSortedByTime] = useState(false);
    const toast = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://backend-quck.onrender.com/product/my-prod', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            setProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = async (newProduct) => {
        try {
            await axios.post('https://backend-quck.onrender.com/product/create', newProduct, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = async (updatedProduct) => {
        try {
            await axios.put(`https://backend-quck.onrender.com/product/edit/${updatedProduct.id}`, updatedProduct, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            fetchProducts();
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`https://backend-quck.onrender.com/product/delete/${id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
            });
            toast({
                description: "Product deleted successfully",
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleScheduleAddition = () => {
        const delay = parseInt(scheduleTime) * 60000;
        setTimeout(() => {
            handleAddProduct({
                name: 'Scheduled Product',
                description: 'This product was added automatically',
                price: 0,
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUls49w0kK_YppGMuppVYlBNenKcJiY1aUmA&s",
                product_type: "Electronic"
            });
        }, delay);
        setScheduleTime('');
        toast({
            description: "Scheduled Product added successfully",
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
    };

    const handleFilter = (criteria) => {
        let filteredProducts = [...products];

        if (criteria.type) {
            filteredProducts = filteredProducts.filter(product => product.product_type === criteria.type);
        }

        if (criteria.priceOrder) {
            filteredProducts.sort((a, b) => {
                return criteria.priceOrder === 'lowToHigh' ? a.price - b.price : b.price - a.price;
            });
        }

        setFilteredProducts(filteredProducts);
    };

    const handleSortByTime = () => {
        if (isSortedByTime) {
            setFilteredProducts(products);
        } else {
            const sortedProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setFilteredProducts(sortedProducts);
        }
        setIsSortedByTime(!isSortedByTime);
    };

    return (
        <>
            <Navbar />
            <div className="product-page-container">
                <div className="product-page-header">
                    <div>
                        <button className="product-page-button" onClick={() => setIsAddModalOpen(true)}>Add Product</button>
                        <input
                            type="number"
                            className="product-page-input"
                            placeholder="Schedule time in minutes"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                        />
                        <button className="product-page-button" onClick={handleScheduleAddition}>Schedule Addition</button>
                    </div>
                </div>
                <ProductList
                    products={filteredProducts}
                    onEdit={(product) => { setEditProduct(product); setIsEditModalOpen(true); }}
                    onDelete={handleDeleteProduct}
                    onFilter={handleFilter}
                    onSortByTime={handleSortByTime}
                />
                <AddProductModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddProduct}
                />
                <EditProductModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    product={editProduct}
                    onEdit={handleEditProduct}
                />
            </div>
        </>
    );
};

export default ProductPage;
