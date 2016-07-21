package <%=packageName%>.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import <%=packageName%>.dto.<%= entityClass %>Dto;

@RestController
@RequestMapping("/<%= entityInstance %>s")
public class <%= entityClass %>Controller {

        @Autowired
        private <%= entityClass %>Source source;


        @RequestMapping(method = RequestMethod.POST)
        public ResponseEntity<?> process<%= entityClass %>(@RequestBody <%= entityClass %>Dto <%= entityInstance %>Dto ) {
                source.sendCar(<%= entityInstance %>Dto);

                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.setLocation(ServletUriComponentsBuilder
                                .fromCurrentRequest().path("/{id}")
                                .buildAndExpand(<%= entityInstance %>Dto.getId()).toUri());
                return new ResponseEntity<>(null, httpHeaders, HttpStatus.CREATED);
        }
}
