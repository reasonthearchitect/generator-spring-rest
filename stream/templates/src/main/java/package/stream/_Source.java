package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Component;

import <%=packageName%>.dto.<%= sourceDtoClass %>;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.logging.Level;
import lombok.extern.java.Log;

@Log
@Component
public class <%= entityClass %>Source {

        @Autowired @Qualifier("<%=  sourceName %>")
        private MessageChannel post;

        @Autowired
        ObjectMapper mapper;

        public void send(<%= sourceDtoClass %> <%= sourceDtoInstance %>) {
                try {
                        Message<?> message = MessageBuilder.withPayload(
                                        mapper.writerWithDefaultPrettyPrinter().writeValueAsString(<%= sourceDtoInstance %>)
                                )
                                .setHeader("content-type", "application/json")
                                .build();
                        post.send(message);
                } catch (Exception ex) {
                        log.log(Level.SEVERE, "Error trying to send a message to a queue: ", ex);
                }        
        }

}
