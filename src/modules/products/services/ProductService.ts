import { InternalServerError, NotFoundError } from "@/common";
import { stripe } from "@/libs";
import { PriceDto, PriceService } from "@/modules/prices";
import { ProductDto } from "@/modules/products";
import Stripe from "stripe";

export class ProductService {
  private priceService = new PriceService();

  private stripeProductToDto = (product: Stripe.Product): ProductDto => {
    // Get default price ID, handling both string and object formats
    const defaultPriceId =
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price?.id || null;

    // Map product features to string array and omit features with no name
    const marketingFeatures = product.marketing_features.flatMap((feature) => {
      if (!feature.name) return []; // Omit empty features
      return feature.name;
    });

    const productDto: ProductDto = {
      id: product.id,
      name: product.name,
      active: product.active,
      defaultPriceId,
      description: product.description,
      images: product.images,
      marketingFeatures,
      type: product.type,
      metadata: product.metadata,
    };

    return productDto;
  };

  /**
   * Gets all products from Stripe product catelog.
   *
   * @returns {ProductDto} ProductDto
   */
  getProducts = async (): Promise<ProductDto[]> => {
    try {
      // Get products
      const products = await stripe.products.list();

      // Return array of ProductDtos
      const productDtos = products.data.map((product) =>
        this.stripeProductToDto(product)
      );

      return productDtos;
    } catch (error) {
      throw new InternalServerError(`Error getting product by id.`, {
        error,
      });
    }
  };

  /**
   * Gets product by id.
   *
   * @throws {NotFoundError} If product does not exist.
   * @returns {ProductDto} ProductDto
   */
  getProductById = async (id: string): Promise<ProductDto> => {
    try {
      // Get product by id
      const product = await stripe.products.retrieve(id);

      // Return ProductDto
      const productDto = this.stripeProductToDto(product);

      return productDto;
    } catch (error) {
      // Handle stripe errors
      if (error instanceof Stripe.errors.StripeError)
        switch (error.statusCode) {
          case 404:
            throw new NotFoundError("Product not found.", { error });
        }

      // Otherwise throw InternalServerError and include unrecognized error
      throw new InternalServerError(`Error getting product by id.`, {
        error,
      });
    }
  };

  /**
   * Gets prices by product id.
   *
   * @throws {NotFoundError} If product does not exist.
   * @returns {PriceDto[]} PriceDto[]
   */
  getProductPricesById = async (id: string): Promise<PriceDto[]> => {
    // Get product by id (throws not found)
    const product = await this.getProductById(id);

    // Get price dtos
    const priceDtos = await this.priceService.getPricesByFilter({
      product: product.id,
      active: true,
    });

    return priceDtos;
  };
}
