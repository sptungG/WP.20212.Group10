## Data schema (12)

- UserSchema
- AddressSchema
- ProductSchema
- VariantSchema
- ComboSchema
- CategorySchema
- ReviewSchema
- WishlistSchema
- ImageSchema
- ContentSchema
- CartSchema
- OrderSchema

```js
// 1. UserSchema
  {
    name: String,
    picture: String,
    phone: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "user",
    },
    defaultAddress: {
      type: ObjectId,
      ref: "Address",
    },
    emailVerified: { type: Boolean, default: false },
    cart: { type: ObjectId, ref: "Cart" },
    history: [{ type: ObjectId, ref: "Order" }],
    wishlist_products: [{ type: ObjectId, ref: "Product" }],
    wishlist_combos: [{ type: ObjectId, ref: "Combo" }],
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
```

```js
// 2. AddressSchema
  {
    createdBy: { type: ObjectId, ref: "User" },
    name: { type: String, required: true },
    phoneNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "VietNam",
    },
  },
```

```js
// 3. ProductSchema
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      text: true,
      trim: true,
      index: true,
    },
    desc: { type: String, trim: true },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [{ type: ObjectId, ref: "Image" }],
    shipping: {
      type: Boolean,
      default: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    numOfViews: {
      type: Number,
      default: 0,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    content: { type: ObjectId, ref: "Content" },
    combos: [{ type: ObjectId, ref: "Combo" }],
    wishlist: [{ type: ObjectId, ref: "User" }],
    variants: [{ type: ObjectId, ref: "Variant" }],
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
```

```js
// 4. VariantSchema
  {
    product: { type: ObjectId, ref: "Product" },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: { type: Number, required: true },
    options: [{ name: String, value: String }],
    image: { type: ObjectId, ref: "Image" },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
```

```js
// 5. ComboSchema
  {
    name: {
      type: String,
      required: true,
      text: true,
    },
    desc: String,
    numOfViews: {
      type: Number,
      default: 0,
    },
    wishlist: [{ type: ObjectId, ref: "User" }],
    image: { type: ObjectId, ref: "Image" },
    products: [
      {
        product: { type: ObjectId, ref: "Product" },
        position: { type: String, trim: true, default: "50%,50%" },
      },
    ],
    comments: [
      {
        createdBy: { type: ObjectId, ref: "User" },
        content: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    content: { type: ObjectId, ref: "Content" },
    createdBy: { type: ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
```

```js
// 6. CategorySchema
  {
    name: {
      type: String,
      required: true,
      text: true,
    },
    image: {
      type: String,
      default: NOT_FOUND_IMG,
    },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
```

```js
// 7. ReviewSchema
  {
    modelId: { type: ObjectId, refPath: "onModel" },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product"],
    },
    createdBy: { type: ObjectId, ref: "User" },
    comment: String,
    rating: { type: Number, required: true },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
  },
```

```js
// 8. WishlistSchema
  {
    modelId: { type: ObjectId, refPath: "onModel" },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product"],
    },
    createdBy: { type: ObjectId, ref: "User" },
  },
```

```js
// 9. ImageSchema
 {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    modelId: { type: ObjectId, refPath: "onModel", default: new ObjectId(), auto: true },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product", "User", "Content"],
    },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
  },
```

```js
// 10. ContentSchema
  {
    title: { type: String, default: "" },
    content: { type: String, default: "" },
    images: [{ type: ObjectId, ref: "Image" }],
    modelId: { type: ObjectId, refPath: "onModel", default: new ObjectId(), auto: true },
    onModel: {
      type: String,
      required: true,
      enum: ["Combo", "Product"],
    },
    status: { type: String, enum: ["active", "inactive", "deleted"], default: "active" },
    createdBy: { type: ObjectId, ref: "User" },
  },
```

```js
// 11. CartSchema
  {
    products: [
      {
        product: { type: ObjectId, ref: "Product" },
        variant: { type: ObjectId, ref: "Variant" },
        count: Number,
        price: Number,
        auto: false
      },
    ],
    cartTotal: Number,
    createdBy: { type: ObjectId, ref: "User" },
  },
```

```js
// 12. OrderSchema
  {
    shippingInfo: {
      name: { type: String, required: true },
      phoneNo: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "VietNam",
      },
    },
    orderItems: [
      {
        saved_name: {
          type: String,
          required: true,
        },
        saved_quantity: {
          type: Number,
          required: true,
        },
        saved_image: {
          type: String,
          required: true,
        },
        saved_price: {
          type: Number,
          required: true,
        },
        saved_variant: {
          type: String,
          required: true,
        },
        product: {
          type: ObjectId,
          required: true,
          ref: "Product",
        },
        variant: {
          type: ObjectId,
          required: true,
          ref: "Variant",
        },
      },
    ],
   paymentInfo: {
      id: String,
      status: String,
      payment_method_types: Array,
      amount: String,
      currency: String,
      created: String,
    },
    paidAt: {
      type: Date,
    },
    itemsPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    deliveredAt: {
      type: Date,
    },
    orderStatus: {
      value: { type: String, default: "Processing" },
      name: { type: String, required: true },
    },
    orderLog: [{ createdAt: Date, createdBy: { type: ObjectId, ref: "User" }, content: String }],
    orderNote: { type: String, default: "" },
    createdBy: { type: ObjectId, ref: "User" },
  },
```
