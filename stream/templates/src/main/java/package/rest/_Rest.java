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

import <%=packageName%>.stream.<%= entityClass %>Source;
import <%=packageName%>.dto.<%= sourceDtoClass %>;

@RestController
@RequestMapping("/<%= entityInstance %>s")
public class <%= entityClass %>Rest {

        @Autowired
        private <%= entityClass %>Source source;


        @RequestMapping(method = RequestMethod.POST)
        public ResponseEntity<?> process(@RequestBody <%= sourceDtoClass %> <%= sourceDtoInstance %> ) {
                source.send(<%= sourceDtoInstance %>);

                HttpHeaders httpHeaders = new HttpHeaders();

                /* - Uncomment to add some additional headers.
                httpHeaders.setLocation(ServletUriComponentsBuilder
                                .fromCurrentRequest().path("/{id}")
                                .buildAndExpand(<%= sourceDtoInstance %>.getId()).toUri());
                */
                return new ResponseEntity<>(null, httpHeaders, HttpStatus.CREATED);
        }
}
