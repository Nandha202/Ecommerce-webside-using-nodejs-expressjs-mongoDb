import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProduct, getProduct } from "../../actions/productActions";
import { clearError, clearProduct, clearProductCreated, clearProductUpdated } from "../../slices/productSlice";
import SideBar from "./Sidebar";


export default function UpdateProduct() {
    const {loading, isProductCreated, isProductUpdated, error, product={} } = useSelector(state => state.productState)
    //1. Creating states for getting inputs
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [seller, setSeller] = useState("");
    const [images, setImages] = useState([]);
    const [imageCleared, setImageCleared] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {id} = useParams();

    // 2. for disable button, showing success redirect , show error 
    
    //3. Show category options in the dropdown
    const categories = [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ];

    //4. getting mutiple image data
    const onChange = (e) => {
        const files =  Array.from(e.target.files);
     
        files.forEach(file => {
            
            const reader = new FileReader();
            reader.onload = () => {
                if(reader.readyState === 2) {
                    setImages(oldArray => [...oldArray, file])
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                }
            }
            reader.readAsDataURL(file)
        });
        console.log(images)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        images.forEach(image => {
            formData.append('images', image);
        })
        formData.append('category', category);
        formData.append('seller', seller);
        formData.append('description', description);
        formData.append('imageCleared', imageCleared)
        dispatch(updateProduct(id, formData))
    }

    const clearImages = () => {
        setImages([]);
        setImagesPreview([])
        setImageCleared(true);
    }

    
       
    useEffect(() => {
        if(product._id) {
            console.log('test')

            setName(product.name);
            setPrice(product.price);
            setDescription(product.description);
            setCategory(product.category);
            setStock(product.stock);
            setSeller(product.seller);
           
            let images = [];
            
            product.images.forEach(product_image => {
                images.push(product_image.image)
            })
            
            setImagesPreview(images);
            
        }
    },[product]) 
    

    useEffect(() => {
        if(isProductCreated){
            toast('Product Created Successfully!', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearProductCreated()) }
            })
            navigate('/admin/products');
            return ;
        }
        if(isProductUpdated){
            setImages([])
            toast('Product Updated Successfully!', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearProductUpdated()) }
            })
            
            return ;
        }
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }

        
        if(!product._id) {
            dispatch(getProduct(id))
        }
        return () => {
            dispatch(clearProduct())
        }
       
    },[dispatch, error,isProductCreated, isProductUpdated])


    return (
        <div className="row">
            <div className='col-12 col-md-2'>
                <SideBar/>
            </div>
            <div className="col-12 col-md-10">
          
                {/* Copied from UserOrders and modified to list admin products */}
                <Fragment>
                    
                <div className="wrapper my-5"> 
                    <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                        <h1 className="mb-4">Update Product</h1>

                        <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            onChange={e=>setName(e.target.value)}
                            value={name}
                        />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price_field">Price</label>
                            <input
                            type="text"
                            id="price_field"
                            className="form-control"
                            onChange={e=>setPrice(e.target.value)}
                            value={price}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description_field">Description</label>
                            <textarea
                            className="form-control" 
                            id="description_field" 
                            onChange={e=>setDescription(e.target.value)}
                            value={description}
                            rows="8" ></textarea>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_field">Category</label>
                            <select 
                            className="form-control" 
                            id="category_field"
                            onChange={e=>setCategory(e.target.value)}
                            value={category}
                            >
                                <option>Select</option>
                                {categories.map(category => (
                                    <option value={category} key={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="stock_field">Stock</label>
                            <input
                            type="number"
                            id="stock_field"
                            className="form-control"
                            onChange={e=>setStock(e.target.value)}
                            value={stock}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="seller_field">Seller Name</label>
                            <input
                            type="text"
                            id="seller_field"
                            className="form-control"
                            onChange={e=>setSeller(e.target.value)}
                            value={seller}
                            />
                        </div>
                        
                        <div className='form-group'>
                            <label>Images</label>
                            
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='product_images'
                                        className='custom-file-input'
                                        id='customFile'
                                        onChange={onChange}
                                        multiple
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Images
                                    </label>
                                </div>
                                {imagesPreview.length > 0 && <span className="mr-2" style={{cursor: 'pointer'}} onClick={clearImages}><i className="fa fa-trash"></i>Clear</span>}
                                
                                {imagesPreview.map(image => (
                                    <img 
                                    src={image} 
                                    key={image} 
                                    alt={'Image Preview'}
                                    className="mt-3 mr-2"
                                    width="55"
                                    height="52"
                                     />
                                ))}
                        </div>

            
                        <button
                        id="login_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading}
                        >
                        Update
                        </button>

                    </form>
                </div>
                </Fragment>
            </div>
        </div>
    )
}