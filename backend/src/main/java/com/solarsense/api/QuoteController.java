package com.solarsense.api;

import com.solarsense.entity.QuoteEntity;
import com.solarsense.repository.QuoteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteRepository quoteRepository;

    public QuoteController(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    @PostMapping
    public QuoteEntity save(@RequestBody QuoteEntity quote) {
        return quoteRepository.save(quote);
    }

    @GetMapping
    public List<QuoteEntity> findAll() {
        return quoteRepository.findAll();
    }
}
