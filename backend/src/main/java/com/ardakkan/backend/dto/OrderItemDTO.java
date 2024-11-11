package com.ardakkan.backend.dto;


public class OrderItemDTO {
    private Long orderItemId;
    private ProductModelDTO productModel;
    private int quantity;
    private double unitPrice;
    
    // Getter ve Setter metotları
    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }


    public ProductModelDTO getProductModel() {
		return productModel;
	}

	public void setProductModel(ProductModelDTO productModel) {
		this.productModel = productModel;
	}

	public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

	public double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(double unitPrice) {
		this.unitPrice = unitPrice;
	}
    
    
}

