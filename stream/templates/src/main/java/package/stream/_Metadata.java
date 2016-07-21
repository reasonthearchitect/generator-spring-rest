package <%=packageName%>.stream;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;
import org.springframework.stereotype.Component;

@Component
public interface <%= entityClass %>Metadata {
	<% if (channelType == 'sink' || channelType == 'processor') { %>
		@Input("<%=sinkName%>")
    	SubscribableChannel read<%= entityClass %>();
	<% } %> <% if (channelType == 'source' || channelType == 'processor') { %>
		@Output("<%=sourceName%>")
    	MessageChannel post<%= entityClass %>();<% } %>
}