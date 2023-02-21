import { Fragment, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import Loader from '../layouts/Loader';
import SideBar from './Sidebar';
import {MDBDataTable} from 'mdbreact'
import { getAdminProducts, deleteProduct } from '../../actions/productActions';
import { toast } from 'react-toastify';
import { clearError ,clearProductDeleted} from '../../slices/productSlice';

export default function ProductList() {
    const {products=[],loading=true, error } = useSelector(state => state.productsState)
    const {error:productError,  isProductDeleted} = useSelector(state => state.productState)

    // copied & modified from UserOrder "setOrders" code  for seeding Datatable
    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: "ID",
                    field: 'id',
                    sort: "asc"
                },
                {
                    label: "Name",
                    field: 'name',
                    sort: "asc"
                },
                {
                    label: "Price",
                    field: 'price',
                    sort: "asc"
                },
                {
                    label: "Stock",
                    field: 'stock',
                    sort: "asc"
                },
                {
                    label: "Actions",
                    field: 'actions',
                    sort: "asc"
                }
            ],
            rows:[]
        }


      

        products.forEach(product => {
            data.rows.push({
                id:  product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions:(
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary" >
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <Button onClick={(e)=>deleteHandler(e, product._id)} className="btn btn-danger py-1 px-2 ml-2" >
                            <i className='fa fa-trash'></i>
                        </Button>
                    </Fragment>
                )
            })
        })


        return  data;
    }

    const dispatch = useDispatch();
    const deleteHandler =  (e, id) => {
        e.target.disabled=true; 
        dispatch(deleteProduct(id))
    }
    useEffect(() => {
        if(error || productError)  {
            toast(error || productError, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(isProductDeleted) {
            toast('Product Deleted SuccessFully', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearProductDeleted()) }
            })
        }
        dispatch(getAdminProducts) 
    },[dispatch, error, isProductDeleted])

    return (
        <div className="row">
            <div className='col-12 col-md-2'>
                <SideBar/>
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Products</h1>
                {/* Copied from UserOrders and modified to list admin products */}
                <Fragment>
                    { loading ? <Loader/>:
                    <MDBDataTable
                        className='px-3'
                        bordered
                        striped
                        hover
                        data={setProducts()}
                    />
                    }
                </Fragment>
            </div>
        </div>
    )
}