package com.ardakkan.backend.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ardakkan.backend.entity.ProductModel;
import com.ardakkan.backend.entity.RefundRequest;
import com.ardakkan.backend.entity.RefundStatus;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, Long> {
	List<RefundRequest> findByStatus(RefundStatus status);


}
