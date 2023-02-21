import { Fragment, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import Loader from '../layouts/Loader';
import SideBar from './Sidebar';
import {MDBDataTable} from 'mdbreact'
import { adminOrders as adminOrdersAction, deleteOrder } from '../../actions/orderActions';
import { toast } from 'react-toastify';
import { clearError ,clearOrderDeleted} from '../../slices/orderSlice';

export default function OrderList() {
    const {adminOrders=[],loading=true, error,  isOrderDeleted } = useSelector(state => state.orderState)
    
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: "ID",
                    field: 'id',
                    sort: "asc"
                },
                {
                    label: "No of Items",
                    field: 'numOfItems',
                    sort: "asc"
                },
                {
                    label: "Amount",
                    field: 'amount',
                    sort: "asc"
                },
                {
                    label: "Status",
                    field: 'status',
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

        adminOrders.forEach(order => {
            data.rows.push({
                id:  order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status:<p style={{color: order.orderStatus.includes( 'Delivered' ) ? 'green' : 'red'}}>{order.orderStatus}</p>,
                actions:(
                    <Fragment>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary" >
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <Button onClick={(e)=>deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2" >
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
        dispatch(deleteOrder(id))
    }
    useEffect(() => {
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(isOrderDeleted) {
            toast('Order Deleted SuccessFully', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearOrderDeleted()) }
            })
        }
        dispatch(adminOrdersAction) 
    },[dispatch, error, isOrderDeleted])

    return (
        <div className="row">
            <div className='col-12 col-md-2'>
                <SideBar/>
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Orders</h1>
                <Fragment>
                    { loading ? <Loader/>:
                    <MDBDataTable
                        className='px-3'
                        bordered
                        striped
                        hover
                        data={setOrders()}
                    />
                    }
                </Fragment>
            </div>
        </div>
    )
}