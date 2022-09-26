import { Routes, Route } from "react-router-dom";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// custom components
import Home from "./pages/Home"
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        users: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      {/* <Header /> */}
      <main className="max-w-6xl mx-auto border-red-500 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* <Route path="/project/:id" element={<Project />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
    </ApolloProvider>
  )
}

export default App