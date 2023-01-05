Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length"> 
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors"> {{error}} </li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review" placeholder="review"></textarea>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <div>
                <p>Would you recommend this product?</p>
                <select v-model="recommend">
                    <option disabled value="" selected>Please select one</option>
                    <option value=1>Yes</option>
                    <option value=0>No</option>
                </select>
            </div>
    
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                }
    
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
                this.errors = [] 
            }
            else {
                this.errors = []
                if (!this.name) this.errors.push("Name Requried")
                if (!this.review) this.errors.push("Review Requried")
                if (!this.rating) this.errors.push("Rating Requried")
                if (!this.recommend) this.errors.push("Recommendation Requried")
            }

             
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            requried: true,
        }
    },
    template: `
        <div>
            <li v-for="detail in details">{{ detail }}</li>
        </div>
    `,
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template: `
        <div class="product">

            <div class="product-image">
                <img :src="image">
            </div>

            <div class="product-info">
                <h1> {{ title }} </h1>
                <p> {{ description }}</p>
                <a :href="link" target="_blank">More Products Like These</a>
                <h3> {{ sale }}</h3>

                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>

                <p> Shipping: {{ shipping }} </p>

                <h4>Product Detail</h4>
                <product-details :details="details"></product-details>

                <h4>Available In</h4>

                <div class="color-box"
                v-for="(variant, index) in variants" 
                :key="variant.variantId"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
                </div>
        
                <button v-on:click="addToCart" 
                :disabled="!inStock"
                :class="{disabledButton : !inStock}">Add to Cart</button>

                <button v-on:click="removeFromCart" 
                :disabled="!inStock"
                :class="{disabledButton : !inStock}">Remove</button>
            </div>

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                <li v-for="review in reviews">
                    <p> {{ review.name }} </p>
                    <p>Rating: {{ review.rating }} </p>
                    <p> {{ review.review }} </p>
                    <p v-if="review.recommend == 1">I will recommend this.</p>
                    <p v-else>I will not recommend this.</p>
                </li>
                </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>

        </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Jockey",
            description: "These are warm and cozy",
            link: "https://www.amazon.in/s?k=socks&ref=nb_sb_noss",
            onSale: true,
            details: ["80% Cotton", "20% Polyester", "Gender-Neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "Green",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: "Blue",
                    variantImage: "https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 10,
                }
            ],
            selectedVariant: 0,
            reviews: []
        }
    },

    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            // console.log(index)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },

    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' is on Sale!!!'
            }

            return this.brand + ' ' + this.product + ' is not on Sale!!!'
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else {
                return "$ " + 2.99
            }
        },
    }

})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            for (var i = this.cart.length; i >= 0; i--) {
                if (this.cart[i] == id) {
                    this.cart.splice(i, 1)
                    break
                }
            }
        }
    }
})