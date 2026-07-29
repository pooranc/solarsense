package com.solarsense.api;

import com.solarsense.entity.BillEntity;
import com.solarsense.repository.BillRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")

public class BillController {

    private final BillRepository billRepository;

    public BillController(BillRepository billRepository){
        this.billRepository = billRepository;
    }

    @PostMapping
    public BillEntity save(@RequestBody BillEntity bill){
        return billRepository.save(bill);
    }

    @GetMapping
    public List<BillEntity> findAll() {
        return billRepository.findAll();
    }
}
