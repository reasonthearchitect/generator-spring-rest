package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import <%=packageName%>.dto.<%= sinkDtoClass %>;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.logging.Level;
import lombok.extern.java.Log;

@Log
@EnableBinding(<%= entityClass %>Metadata.class)
public class <%= entityClass %>Sink {

    @Autowired
    ObjectMapper mapper;


    @StreamListener("<%= sinkName %>")
    public void sink(<%= sinkDtoClass %> <%= sinkDtoInstance %>) {
        
        try {
            log.log(Level.INFO, this.mapper.writerWithDefaultPrettyPrinter().writeValueAsString(<%= sinkDtoInstance %>));
        } catch (Exception ex) {
            log.log(Level.SEVERE, "Exception thrown and could not map.", ex);
        }
    }
}
