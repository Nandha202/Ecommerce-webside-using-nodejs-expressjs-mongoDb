import { Fragment, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import SideBar from './Sidebar';
import {MDBDataTable} from 'mdbreact'
import { getReviews , deleteReview } from '../../actions/productActions';
import { toast } from 'react-toastify';
import { clearError ,clearReviewDeleted} from '../../slices/productSlice';

export default function ReviewList() {
    const {reviews=[],loading, error,  isReviewDeleted } = useSelector(state => state.productState)
    const [productId, setProductId] = useState("");
    const setReviews = () => {
        const data = {
            columns: [
                {
                    label: "ID",
                    field: 'id',
                    sort: "asc"
                },
                {
                    label: "Rating",
                    field: 'rating',
                    sort: "asc"
                },
                {
                    label: "Comment",
                    field: 'comment',
                    sort: "asc"
                },
                {
                    label: "User",
                    field: 'user',
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

        reviews.forEach(review => {
            data.rows.push({
                id:  review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.user.name,
                actions:(
                    <Fragment>
                        <Button onClick={(e)=>deleteHandler(e,  review._id)} className="btn btn-danger py-1 px-2 ml-2" >
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
        dispatch(deleteReview(productId, id))
    }
    const searchHandler =  (e) => {
        e.preventDefault();
        dispatch(getReviews(productId)) 
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
        if(isReviewDeleted) {
            toast('Review Deleted SuccessFully', {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'success',
                onOpen: ()=> { dispatch(clearReviewDeleted()) }
            })
            dispatch(getReviews(productId)) 
        }
        
    },[dispatch, error, isReviewDeleted, productId])

    return (
        <div className="row">
            <div className='col-12 col-md-2'>
                <SideBar/>
            </div>
            <div className="col-12 col-md-10">
                <h1 className="my-4">Reviews</h1>
                <div className="row justify-content-center mt-5">
			        <div className="col-5">
                            <form onSubmit={searchHandler}>
                                <div className="form-group">
                                    <label htmlFor="productId_field">Enter Product ID</label>
                                    <input
                                        type="text"
                                        id="email_field"
                                        className="form-control"
                                        onChange={e => setProductId(e.target.value)}
                                        value={productId}
                                    />
                                </div>

                                <button
                                    disabled={loading}
                                    id="search_button"
                                    type="submit"
                                    className="btn btn-primary btn-block py-2"
                                >
                                    SEARCH
								</button>
                            </form>
                    </div>
                </div>
               
                    { reviews && reviews.length > 0 ?  <Fragment>:
                            <MDBDataTable
                                className='px-3'
                                bordered
                                striped
                                hover
                                data={setReviews()}
                            />
                    </Fragment>:null
                    }
                
            </div>
        </div>
    )
}