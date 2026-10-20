<?php

namespace App\Features\Product;

use App\Features\Product\Product;
use App\Features\Product\ProductResource;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        // Filter by category
        if ($request->has('category') && !empty($request->category) && strtolower($request->category) !== 'all') {
            $query->where('category', 'LIKE', '%' . $request->category . '%');
        }

        // Search by keyword (name or description)
        $search = $request->input('search', $request->input('q'));
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Filter popular products
        if ($request->has('is_popular')) {
            $isPopular = filter_var($request->input('is_popular'), FILTER_VALIDATE_BOOLEAN);
            $query->where('is_popular', $isPopular);
        }

        // Sorting
        $sort = $request->input('sort');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        // Pagination or fetch all
        if ($request->boolean('paginate', false)) {
            $perPage  = (int) $request->input('per_page', 10);
            $products = $query->paginate($perPage);

            return $this->sendResponse(
                ProductResource::collection($products->items()),
                'Products fetched successfully',
                200,
                [
                    'pagination' => [
                        'current_page' => $products->currentPage(),
                        'last_page'    => $products->lastPage(),
                        'per_page'     => $products->perPage(),
                        'total'        => $products->total(),
                    ]
                ]
            );
        }

        $products = $query->get();

        return $this->sendResponse(
            ProductResource::collection($products),
            'Products fetched successfully',
            200,
            ['total' => $products->count()]
        );
    }

    /**
     * Display the specified product.
     */
    public function show(string|int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->sendError('Product not found', 404);
        }

        return $this->sendResponse(new ProductResource($product), 'Product detail fetched successfully');
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'category'      => 'required|string|max:100',
            'price'         => 'required|numeric|min:0',
            'old_price'     => 'nullable|numeric|min:0',
            'rating'        => 'nullable|numeric|min:0|max:5',
            'reviews_count' => 'nullable|integer|min:0',
            'image_url'     => 'required|string',
            'badge'         => 'nullable|string|max:100',
            'description'   => 'nullable|string',
            'is_popular'    => 'nullable|boolean',
        ]);

        $product = Product::create($validated);

        return $this->sendResponse(new ProductResource($product), 'Product created successfully', 201);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, string|int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->sendError('Product not found', 404);
        }

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'category'      => 'sometimes|string|max:100',
            'price'         => 'sometimes|numeric|min:0',
            'old_price'     => 'nullable|numeric|min:0',
            'rating'        => 'nullable|numeric|min:0|max:5',
            'reviews_count' => 'nullable|integer|min:0',
            'image_url'     => 'sometimes|string',
            'badge'         => 'nullable|string|max:100',
            'description'   => 'nullable|string',
            'is_popular'    => 'nullable|boolean',
        ]);

        $product->update($validated);

        return $this->sendResponse(new ProductResource($product->fresh()), 'Product updated successfully');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(string|int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return $this->sendError('Product not found', 404);
        }

        $product->delete();

        return $this->sendResponse(null, 'Product deleted successfully');
    }
}
