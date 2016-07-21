package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;

import <%=packageName%>.dto.<%= entityClass %>Dto;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.java.Log;

@EnableBinding(<%= entityClass %>Metadata.class)
public class <%= entityClass %>Sink {

    @Autowired
    ObjectMapper mapper;


    @StreamListener("<%=sinkName%>")
    public void sink(<%= entityClass %>Dto <%= entityInstance %>Dto) {
        
        try {
            log.error(this.mapper.writerWithDefaultPrettyPrinter().writeValueAsString(<%= entityInstance %>Dto));
        } catch (Exception ex) {
            log.error("Exception thrown and could not map.", ex);
        }
    }
}
